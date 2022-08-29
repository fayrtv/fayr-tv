import { Flex } from "@fayr/common";

export default function ImprintFooter() {
    return (
        <Flex className="imprint__links" direction="Row">
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.vfb.de/de/1893/club/service/formales/impressum/"
            >
                Impressum
            </a>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.vfb.de/de/1893/club/service/formales/datenschutz/"
            >
                Datenschutz
            </a>
        </Flex>
    );
}
